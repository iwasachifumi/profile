module.exports = {
  apps: [
    {
      name: "memoria",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      cwd: "/var/www/profile/memoria-next",
      env_production: {
        NODE_ENV: "production",
      },
      // クラッシュ時に自動再起動
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      // ログ
      out_file: "/var/log/pm2/memoria-out.log",
      error_file: "/var/log/pm2/memoria-error.log",
      merge_logs: true,
    },
  ],
};
