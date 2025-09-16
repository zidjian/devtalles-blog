import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    
    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit() {
        this.logger.log('PrismaService initializing...');
        await this.$connect();
        this.logger.log('PrismaService initialized');
    }

}
