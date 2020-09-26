'use strict'

module.exports = {
  actions: [
    {
      type: 'add',
      files: '**',
    },
  ],
  async completed() {
    await this.gitInit()
    await this.npmInstall()
    this.showProjectTips()
  },
}
