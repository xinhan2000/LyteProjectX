import { Controller, Get, Post, Req, Res, Query, Body } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { AxiosResponse } from 'axios';
import { PasswordFlowDto } from './dto/passwordflow.dto';

@Controller('oauth2')
export class Oauth2Controller {
  constructor(
    private readonly oauth2Service: Oauth2Service, // private readonly httpService: HttpService,
  ) {}

  /**
   * Start OAuth2 authorization code flow
   * @param res http request
   * @returns redirect user to the OAuth2 authorization server
   */
  @Get('code')
  async startAuthorizationCodeFlow(@Req() req, @Res() res) {
    return res.redirect(
      await this.oauth2Service.generateAuthorizationCodeRedirectUrl(req, res),
    );
  }

  /**
   * callback uri to receive authorization code from authorization server after user grant the permission.
   * For each 3rd party platform, make sure you set the redirect uri as "https://xxx.xxx.xxx/code/callback",
   * otherwise, it may fail the redirect URI validation rules, see explain here:
   * https://developers.google.com/youtube/reporting/guides/authorization/server-side-web-apps#uri-validation
   *
   * @param code Authorization code returned from 3rd party's authorization server
   * @param state state passed back from authorization server
   * @param error error message returned from authorization server
   * @returns
   */
  @Get('code/callback')
  async processAuthorizationCodeCallback(@Req() req, @Res() res) {
    let result = await this.oauth2Service.processAuthorizationCodeCallback(
      req,
      res,
    );
    res.redirect('result?result=' + result);
  }

  @Get('code/result')
  showResult(@Query('result') result) {
    return result;
  }

  /**
   * Start OAuth2 password flow, use user name and password to get the access token
   * @param res http request
   * @returns
   */
  @Post('password')
  async startAuthorizationPasswordFlow(
    @Req() req,
    @Res() res,
    @Body() message: PasswordFlowDto,
  ) {
    let result = await this.oauth2Service.handleAuthorizationPasswordToken(
      message,
      req,
      res,
    );
    res.redirect('code/result?result=' + result);
  }
}
