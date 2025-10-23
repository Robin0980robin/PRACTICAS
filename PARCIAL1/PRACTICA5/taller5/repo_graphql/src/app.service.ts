import { Injectable } from '@nestjs/common';

/**
 * AppService provides application-wide services.
 */
@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
}