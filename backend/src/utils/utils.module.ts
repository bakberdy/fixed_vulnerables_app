import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [UtilsController],
  providers: [UtilsService],
})
export class UtilsModule {}
