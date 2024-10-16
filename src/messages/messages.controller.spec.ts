import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { NotFoundException } from '@nestjs/common';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

  const mockMessagesService = {
    findAll: jest.fn(() => [
      { id: '1', content: 'Hello World' },
      { id: '2', content: 'Hello Nest' },
    ]),
    findOne: jest.fn((id: string) => {
      if (id === '1') {
        return { id: '1', content: 'Hello World' };
      }
      throw new NotFoundException('Message not found');
    }),
    create: jest.fn((content: string) => ({ id: '3', content })),
    update: jest.fn((id: string, content: string) => {
      if (id === '1') {
        return { id: '1', content };
      }
      throw new NotFoundException('Message not found');
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all messages', () => {
    expect(controller.listMessages()).toEqual([
      { id: '1', content: 'Hello World' },
      { id: '2', content: 'Hello Nest' },
    ]);
  });

  it('should return a single message', async () => {
    expect(await controller.getMessage('1')).toEqual({
      id: '1',
      content: 'Hello World',
    });
  });

  it('should throw an error if message not found', async () => {
    await expect(controller.getMessage('3')).rejects.toThrow(NotFoundException);
  });

  it('should create a new message', () => {
    const dto: CreateMessageDto = { content: 'New Message' };
    expect(controller.createMessages(dto)).toEqual({
      id: '3',
      content: 'New Message',
    });
  });

  it('should update an existing message', () => {
    const dto: CreateMessageDto = { content: 'Updated Message' };
    expect(controller.updateMessage('1', dto)).toEqual({
      id: '1',
      content: 'Updated Message',
    });
  });

  it('should throw an error if updating a non-existing message', async () => {
    const dto: CreateMessageDto = { content: 'Updated Message' };
    await expect(controller.updateMessage('3', dto)).rejects.toThrow(
      NotFoundException,
    );
  });
});
