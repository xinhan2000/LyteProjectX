import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { NetworkUtils } from '../network/NetworkUtils';
import { company_auth_info } from '../../database/entities/';
import { PasswordFlowDto } from './dto/passwordflow.dto';
import {
  DataRequestName,
  DataRequestByName,
} from './datarequest/DataRequestByName';

@Injectable()
export class Oauth2Service {
  GRANT_TYPE_PASSWORD = 'password';

  constructor(
    private readonly httpService: HttpService,
    private dataSource: DataSource,
  ) {}

  async generateAuthorizationCodeRedirectUrl(
    req: any,
    res: any,
  ): Promise<string> {
    let company = req.query.company;
    if (!company) {
      throw Error('company name is empty');
    }

    const companyAuthInfoRepository =
      this.dataSource.getRepository(company_auth_info);
    const companyAuthInfo = await companyAuthInfoRepository.findOneBy({
      name: company,
    });
    if (!companyAuthInfo) {
      throw Error('Company auth info not existed');
    }

    const dataRequest = DataRequestByName.get(company as DataRequestName);
    // const dataRequest = DataRequestByName.get(DataRequestName.SHOPIFY);
    return dataRequest.generateAuthorizationCodeRedirectUrl(
      companyAuthInfo,
      req,
      res,
    );
  }

  async processAuthorizationCodeCallback(req: any, res: any): Promise<string> {
    let code = req.query.code;
    let state = req.query.state;
    let error = req.query.error;
    if (error != null) {
      return error;
    }

    // TODO: add safety check here, which we can pass the info in state
    let company = state;
    if (!company) {
      throw Error('company name is empty');
    }

    const companyAuthInfoRepository =
      this.dataSource.getRepository(company_auth_info);
    const companyAuthInfo = await companyAuthInfoRepository.findOneBy({
      name: company,
    });
    if (!companyAuthInfo) {
      throw Error('Company auth info not existed');
    }

    const dataRequest = DataRequestByName.get(company as DataRequestName);
    // const dataRequest = DataRequestByName.get(DataRequestName.SHOPIFY);
    let data = await dataRequest.processAuthorizationCodeCallback(
      code,
      companyAuthInfo,
      req,
      res,
      this.httpService,
    );

    return await dataRequest.requestData(data, '', res, res, this.httpService);
  }

  async handleAuthorizationPasswordToken(
    message: PasswordFlowDto,
    req: any,
    res: any,
  ) {
    let company = message.company;
    let username = message.username;
    let password = message.password;

    if (!company) {
      throw Error('company name is empty');
    }

    const companyAuthInfoRepository =
      this.dataSource.getRepository(company_auth_info);
    const companyAuthInfo = await companyAuthInfoRepository.findOneBy({
      name: company,
    });
    if (!companyAuthInfo) {
      throw Error('Company auth info not existed');
    }

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const params = {
      grant_type: this.GRANT_TYPE_PASSWORD,
      client_id: companyAuthInfo.client_id,
      client_secret: companyAuthInfo.client_secret,
      scope: companyAuthInfo.scope,
      username: username,
      password: password,
    };

    var data = await NetworkUtils.processNetworkRequest(
      this.httpService,
      companyAuthInfo.token_endpoint,
      'post',
      headers,
      params,
    );

    const dataRequest = DataRequestByName.get(company as DataRequestName);
    return await dataRequest.requestData(data, '', req, res, this.httpService);
  }
}
