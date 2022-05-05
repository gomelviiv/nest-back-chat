import { Controller, Get, Redirect } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private mailService: MailService) {}

  @Redirect(`${process.env.API_APP}`)
  @Get('/activate/:link')
  async userActivated(to, link) {
    try {
      return await this.mailService.sendActivationMail(to, link);
    } catch (error) {
      console.log(error);
    }
  }
}
