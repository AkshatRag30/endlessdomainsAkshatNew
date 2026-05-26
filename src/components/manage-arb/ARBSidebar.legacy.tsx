import { Dispatch, ReactNode, SetStateAction } from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { Button, Col, Container, Nav, NavItem, Row } from 'reactstrap'

import btnstyles from '@styles/Profile-Link.module.scss'
import styles from '@styles/Transactions.module.scss'
import { BsArrowRepeat } from 'react-icons/bs'
import { GoArrowSwitch } from 'react-icons/go'
import { TbWorld } from 'react-icons/tb'

interface ARBSidebarProps {
  selectedMenu: string
  setSelectedMenu: Dispatch<SetStateAction<'reverse' | 'transfer' | 'pd'>>
  children?: ReactNode
}
const ARBSidebar = ({ selectedMenu, setSelectedMenu, children }: ARBSidebarProps) => {
  return (
    <>
      <div
        className={`${styles.scroll} d-block d-lg-none py-md-4 order-0 w-100`}
        style={{
          overflowY: 'auto',
          backgroundColor: '#fff',
          boxShadow: '0px 25px 75px 0px rgba(6, 7, 20, 0.1019607843)',
          borderRadius: '16px',
          borderBottom: '2px solid #bcbcbc',
        }}
      >
        <Nav pills className="flex-nowrap">
          <NavItem>
            <Button
              color="link"
              className={`${btnstyles.profile_links} ${selectedMenu === 'reverse' && btnstyles.active}`}
              tag="a"
              onClick={() => setSelectedMenu('reverse')}
            >
              <BsArrowRepeat size={20} />
              Reverse
            </Button>
          </NavItem>

          <NavItem>
            <Button
              color="link"
              className={`${btnstyles.profile_links} ${selectedMenu === 'transfer' && btnstyles.active}`}
              tag="a"
              onClick={() => setSelectedMenu('transfer')}
            >
              <GoArrowSwitch size={20} />
              Transfer
            </Button>
          </NavItem>
          <NavItem>
            <Button
              color="link"
              className={`${btnstyles.profile_links} ${selectedMenu === 'pd' && btnstyles.active}`}
              tag="a"
              onClick={() => setSelectedMenu('pd')}
            >
              <TbWorld size={20} />
              Parked Domains
            </Button>
          </NavItem>
        </Nav>
      </div>
        <Col lg={3} md={4} className="d-none d-lg-block order-0">
          <Nav className={`flex-column flex-nowrap overflow-auto h-100 ${btnstyles.sidenav_item}`}>
            <NavItem>
              <Button
                color="link"
                className={`${btnstyles.profile_links} ${selectedMenu === 'reverse' && btnstyles.active}`}
                tag="a"
                onClick={() => setSelectedMenu('reverse')}
              >
                <BsArrowRepeat size={20} />
                Reverse
              </Button>
            </NavItem>

            <NavItem>
              <Button
                color="link"
                className={`${btnstyles.profile_links} ${selectedMenu === 'transfer' && btnstyles.active}`}
                tag="a"
                onClick={() => setSelectedMenu('transfer')}
              >
                <GoArrowSwitch size={20} />
                Transfer
              </Button>
            </NavItem>
            <NavItem>
              <Button
                color="link"
                className={`${btnstyles.profile_links} ${selectedMenu === 'pd' && btnstyles.active}`}
                tag="a"
                onClick={() => setSelectedMenu('pd')}
              >
                <TbWorld size={20} />
                Parked Domains
              </Button>
            </NavItem>
          </Nav>
        </Col>
        <Col xs={12} lg={9} className="order-2">
          {children}
        </Col>
    </>
  )
}

export default ARBSidebar
