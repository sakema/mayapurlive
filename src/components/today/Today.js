import React from 'react'
import { Box } from 'grommet'
import GoogleCalendar from '../GoogleCalendar'
import { useLocale } from '../../lib'

const googleCalendar = {
  ru: 'information.department.rc@gmail.com',
  en: 'information.department.eng@gmail.com'
} // FIXME: remove hardcode

export default ({ events }) => {
  const locale = useLocale()
  const mode = 'agenda'
  return (
    <Box flex>
      <GoogleCalendar
        // src='MnVubmc1YmN2dmlzMmMwbzFtbGNibGsyc29AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ'
        src={googleCalendar[locale]}
        mode={mode}
        showNav
        showTabs
        lang={locale}
      />
    </Box>
  )
}
