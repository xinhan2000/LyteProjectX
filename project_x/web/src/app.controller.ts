import { Controller, Req, Res, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { createResultApp } from './../webapp/ssr/dataresult.js';
import { renderToString } from 'vue/server-renderer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ssr')
  async launchSSRPage(@Req() req, @Res() res) {
    const app = createResultApp();

    renderToString(app).then((html) => {
      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vue SSR Example</title>
          <script>var exports = {};</script>
          <script type="importmap">
            {
              "imports": {
                "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
              }
            }
          </script>
          <script type="module" src="/ssr/client.js"></script>
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>
      `);
    });
  }
}
