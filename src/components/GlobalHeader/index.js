import React, { PureComponent } from 'react';
import {connect} from 'dva';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, message } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import NoticeIcon from '../../components/NoticeIcon';
import HeaderSearch from '../../components/HeaderSearch';
import styles from './index.less';

const { Header } = Layout;

// TODO 设置 user API
@connect((state) => ({
  userName:state.login.userName,
}))
export default class GlobalHeader extends PureComponent {

  constructor(props){
    super(props);
    // this.props.dispatch({
    //   type: 'user/fetchCurrent',
    //   userName:this.props.userName,
    // });

  }
  componentDidMount() {

    // this.props.dispatch({
    //   type: 'user/fetchCurrent',
    //   userName:this.props.userName,
    // });
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }
  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }
  toggle = () => {
    const { collapsed } = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser, collapsed, fetchingNotices,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <Header className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
{/*          <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder="站内搜索"
            dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
            onSearch={(value) => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={(value) => {
              console.log('enter', value); // eslint-disable-line
            }}
          />
          <NoticeIcon
            className={styles.action}
            count={currentUser.notifyCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={this.handleNoticeClear}
            onPopupVisibleChange={this.handleNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={noticeData['通知']}
              title="通知"
              emptyText="你已查看所有通知"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['消息']}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['待办']}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                {currentUser.name}
              </span>
            </Dropdown>
          ) : <Spin size="small" style={{ marginLeft: 8 }} />}*/}
        </div>
      </Header>
    );
  }
}
