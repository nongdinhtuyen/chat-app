import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Response,
  UseGuards,
  Req,
  Logger,
  Res,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public, ResponseMessage, Roles } from 'src/decorator';
import { ChatService } from './chat.service';
import { RequestListChatDto } from './dto/request-list-message.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('message/:id')
  findAll(@Query() qs: RequestListChatDto) {
    return this.chatService.findAll(qs);
  }
}
