import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Tooltip from '@mui/material/Tooltip'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'

const MENU_STYLE = {
  backgroundColor: 'transparent',
  color: 'white',
  border: 'none',
  // paddingX: '5px',
  borderRadius: '5px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    backgroundColor: 'primary.50'
  }
}

const BoardBar = ({ board }) => {
  return (
    <Box px={2} sx={{
      // backgroundColor: 'primary.dark',
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description} >
          <Chip
            sx={MENU_STYLE}
            icon={<DashboardIcon />}
            label= { board?.title }
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label= { capitalizeFirstLetter(board?.type) }
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filtes"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
        >
          Invite
        </Button> */}
        {/* <AvatarGroup
          max={7}
          sx={{
            '& .MuiAvatar-root': {
              width: '34px',
              height: '34px',
              fontSize: '16px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&.MuiAvatar-colorDefault': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title='Kirito'>
            <Avatar alt="Kirito" src="https://i.pinimg.com/originals/d5/99/50/d5995054eadb079af0e1b495c5029b2c.jpg" />
          </Tooltip>
          <Tooltip title='Alice'>
            <Avatar alt="Alice" src="https://i.pinimg.com/originals/4f/eb/67/4feb67fec07558c85a2491ce7ae83685.jpg" />
          </Tooltip>
          <Tooltip title='Asuna'>
            <Avatar alt="Asuna" src="https://i.pinimg.com/originals/17/aa/fb/17aafb3574aea652e5a06a05d0114e31.jpg" />
          </Tooltip>
          <Tooltip title='Sinon'>
            <Avatar alt="Sinon" src="https://i.pinimg.com/originals/92/41/95/924195f5d4c7b19013655ce8d9486383.gif" />
          </Tooltip>
          <Tooltip title='Eugeo'>
            <Avatar alt="Eugeo" src="https://i.pinimg.com/originals/bb/fb/b3/bbfbb372d5a75c9843bd525a402b45f2.jpg" />
          </Tooltip>
          <Tooltip title='Yui'>
            <Avatar alt="Yui" src="https://i.pinimg.com/originals/e5/8d/04/e58d04ef8008cf28e7df29217b57cecf.jpg" />
          </Tooltip>
          <Tooltip title='Nobuyuki Sugō'>
            <Avatar alt="Nobuyuki Sugō" src="https://i.pinimg.com/originals/ef/14/28/ef1428458dfdbfe06fb960c5a46600a0.jpg" />
          </Tooltip>
          <Tooltip title='Klein'>
            <Avatar alt="Klein" src="https://i.pinimg.com/originals/3f/ba/f3/3fbaf38d89296b5c9d6da34f89a549df.jpg" />
          </Tooltip>
        </AvatarGroup> */}

        {/* Mời user làm thành viên của board */}
        <InviteBoardUser boardId={board?._id} />

        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
