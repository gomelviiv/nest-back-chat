import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendActionMail(to, link) {
    return `${to}to ${link}`;
  }
}
