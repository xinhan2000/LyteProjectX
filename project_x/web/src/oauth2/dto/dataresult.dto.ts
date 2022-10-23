export class DataResultValueDto {
  constructor(key: string, value: any, dataResultApiDto: DataResultApiDto) {
    this.key = key;
    this.value = value;
    dataResultApiDto.results.push(this);
  }

  key: string;
  value: any;
}

export class DataResultApiDto {
  constructor(name: string, dataResultAccountDto: DataResultAccountDto) {
    this.name = name;
    this.results = new Array();
    dataResultAccountDto.apis.push(this);
  }

  name: string;
  results: Array<DataResultValueDto>;
}

export class DataResultAccountDto {
  constructor(name: string, dataResultDto: DataResultDto) {
    this.name = name;
    this.apis = new Array();
    dataResultDto.accounts.push(this);
  }

  name: string;
  apis: Array<DataResultApiDto>;
}

export class DataResultDto {
  constructor(name: string) {
    this.name = name;
    this.accounts = new Array();
  }

  name: string;
  accounts: Array<DataResultAccountDto>;
}
