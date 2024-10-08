import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorator';
import { IUser } from '../users/users.interface';

@Controller('channels')
@ApiTags('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(
    @Body() createChannelDto: CreateChannelDto,
    @CurrentUser() user: IUser,
  ) {
    return this.channelService.create(createChannelDto, user);
  }

  @Get()
  findAll() {
    // return this.channelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }
}
