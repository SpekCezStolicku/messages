import { Injectable, NotFoundException } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class MessagesRepository {
  private readonly filePath = 'messages.json';

  private async readMessagesFile() {
    const contents = await readFile(this.filePath, 'utf-8');
    return JSON.parse(contents);
  }

  private async writeMessagesFile(messages: Record<string, any>) {
    await writeFile(this.filePath, JSON.stringify(messages, null, 2));
  }

  async findOne(id: string) {
    const messages = await this.readMessagesFile();

    const message = messages[id];
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async findAll() {
    return await this.readMessagesFile();
  }

  async create(content: string) {
    const messages = await this.readMessagesFile();

    const id = Math.floor(Math.random() * 999).toString();
    messages[id] = { id, content };

    await this.writeMessagesFile(messages);

    return messages[id];
  }

  async update(id: string, content: string) {
    const messages = await this.readMessagesFile();

    if (!messages[id]) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    messages[id].content = content;

    await this.writeMessagesFile(messages);

    return messages[id];
  }
}
