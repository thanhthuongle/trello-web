import Box from '@mui/material/Box'

const BoardContent = () => {
  return (
    <Box px={2} sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      width: '100%',
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      display: 'flex',
      alignItems: 'center'
    }}>
      Board Content
    </Box>
  )
}

export default BoardContent
