import { List } from '@/components/List'
import Link from 'next/link'
import { GET } from './api/profile/route'
import { Box, Typography } from '@mui/material'
import DeviceHubIcon from '@mui/icons-material/DeviceHub'

export default async function HomePage() {
  const data = await GET()
  const dataAsJson = await data.json()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Typography variant='h1' color='primary'>
        Hello TrainingHub
      </Typography>
      <DeviceHubIcon fontSize='small' />
      <List
        data={[
          { header: 'List header', description: JSON.stringify(dataAsJson) },
          { header: 'Random header', description: 'Random description' },
        ]}
      />
    </Box>
  )
}
