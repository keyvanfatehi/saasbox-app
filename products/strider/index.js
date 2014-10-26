module.exports = {
  title: 'Strider-CD',
  version: '1.6.0-pre.2',
  description: "continuous integration and deployment platform",
  sourceCodeURL: 'https://github.com/Strider-CD/strider',
  monthlyPremium: 3000,
  minMemory: 1024,
  configSchema: {
    PLUGIN_GITHUB_APP_ID: {
      label: "Github App Client Id"
    },
    PLUGIN_GITHUB_APP_SECRET: {
      label: "Github App Secret"
    },
    SMTP_HOST: {
      label: "SMTP Host"
    },
    SMTP_USER: {
      label: "SMTP Username"
    },
    SMTP_PASS: {
      label: "SMTP Password",
      type: 'password'
    },
    SMTP_FROM: {
      label: "SMTP From Address"
    }
  }
}
