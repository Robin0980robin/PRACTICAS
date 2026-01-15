import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import { UpdateRepairOrderDto } from './dto/update-repair-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepairStatus, RepairOrder } from './entities/repair-order.entity';
import { Repository } from 'typeorm';
import { WebhookEmitterService } from '../common/webhook-emitter.service';

@Injectable()
export class RepairOrdersService {
  constructor(
    @InjectRepository(RepairOrder)
    private readonly repairOrderRepository: Repository<RepairOrder>,
    private readonly webhookEmitterService: WebhookEmitterService,
  ) {}

  async create(
    dto: CreateRepairOrderDto,
    status: OrderRepairStatus = 'IN_REVIEW',
  ): Promise<RepairOrder> {
    const repairOrder = this.repairOrderRepository.create({
      ...dto,
      status,
    });
    const savedOrder = await this.repairOrderRepository.save(repairOrder);
    await this.webhookEmitterService.emit('repair_order.created', {
      orderId: savedOrder.id,
      equipmentId: savedOrder.equipmentId,
      technicianId: savedOrder.technicianId,
      problemDescription: savedOrder.problemDescription,
      status: savedOrder.status,
      createdAt: savedOrder.createdAt,
    });
    return savedOrder;
  }

  async createPending(dto: CreateRepairOrderDto): Promise<RepairOrder> {
    return await this.create(dto, 'PENDING');
  }

  async findAll(): Promise<RepairOrder[]> {
    return await this.repairOrderRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findActive(): Promise<RepairOrder[]> {
    return await this.repairOrderRepository.find({
      where: [
        { status: 'IN_REVIEW' },
        { status: 'IN_REPAIR' },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findPending(): Promise<RepairOrder[]> {
    return await this.repairOrderRepository.find({
      where: { status: 'PENDING' },
      order: { createdAt: 'DESC' },
    });
  }

  async findFailed(): Promise<RepairOrder[]> {
    return await this.repairOrderRepository.find({
      where: { status: 'FAILED' },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<RepairOrder> {
    const order = await this.repairOrderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Repair order with ID ${id} not found`);
    return order;
  }

  async update(id: string, dto: UpdateRepairOrderDto): Promise<RepairOrder> {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return await this.repairOrderRepository.save(order);
  }

  async updateStatus(id: string, status: OrderRepairStatus, failureReason?: string): Promise<RepairOrder> {
    const order = await this.findOne(id);
    order.status = status;
    if (failureReason) {
      order.failureReason = failureReason;
    }
    const updatedOrder = await this.repairOrderRepository.save(order);
    
    // 🔔 EMIT EVENT based on status
    const eventMap: Record<OrderRepairStatus, string> = {
      'PENDING': 'repair_order.pending',
      'IN_REVIEW': 'repair_order.in_review',
      'IN_REPAIR': 'repair_order.confirmed',
      'DELIVERED': 'repair_order.delivered',
      'FAILED': 'repair_order.failed',
    };
    
    await this.webhookEmitterService.emit(eventMap[status], {
      orderId: updatedOrder.id,
      equipmentId: updatedOrder.equipmentId,
      status: updatedOrder.status,
      failureReason: updatedOrder.failureReason,
    });
    
    return updatedOrder;
  }

  async confirmReview(id: string): Promise<RepairOrder> {
    return await this.updateStatus(id, 'IN_REPAIR');
  }

  async rejectRepair(id: string, failureReason: string): Promise<RepairOrder> {
    return await this.updateStatus(id, 'FAILED', failureReason);
  }

  async confirmRepair(id: string): Promise<RepairOrder> {
    return await this.updateStatus(id, 'DELIVERED');
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.repairOrderRepository.remove(order);
  }
}
