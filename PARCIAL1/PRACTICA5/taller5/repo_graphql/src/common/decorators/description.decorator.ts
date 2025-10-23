import { SetMetadata } from '@nestjs/common';

export const DESCRIPTION_KEY = 'description';
export const Description = (description: string) => SetMetadata(DESCRIPTION_KEY, description);