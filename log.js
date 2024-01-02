

winston.logger({
    transports: [
      new transports.File({
        level:'warn',
        filename: 'logsWarning.log'
      }),
      new transports.File({
        level:'err',
        filename: 'logsError.log'
      })
    ],
    format: format.combine(
      format.json(),
      format.timestamp(),
      format.prettyPrint()
    ),
    statusLevels: true,
})