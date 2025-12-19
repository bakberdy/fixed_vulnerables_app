import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { GigsModule } from './gigs/gigs.module';
import { ProjectsModule } from './projects/projects.module';
import { ProposalsModule } from './proposals/proposals.module';
import { OrdersModule } from './orders/orders.module';
import { MessagesModule } from './messages/messages.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    AuthModule,
    UsersModule,
    FilesModule,
    GigsModule,
    ProjectsModule,
    ProposalsModule,
    OrdersModule,
    MessagesModule,
    ReviewsModule,
    TransactionsModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
