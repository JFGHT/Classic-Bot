import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { logOut as logOutAction } from '../store/actions';
import '../css/header.css';

class Header extends React.Component {

  render() {
    const { title, subTitle, onBack, logOut, onTitleClick } = this.props;

    return (
      <div className="header__container">
        <div className="header__arrowleft__container">
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="lg"
            className="header__arrowleft"
            onClick={() => { onBack(); }}
          />
        </div>
        <div
          className={`header__title__container ${onTitleClick && 'header__title__container__click'}`}
          onClick={() => { onTitleClick && onTitleClick(); }}
        >
          <h4 className="header__title">{title}</h4>
          {subTitle 
            ? (
              <Badge color="secondary" className="header__sub__title">{subTitle}</Badge>
            )
            : null
          }
        </div>
        <div className="header__fake__item" >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            size="lg"
            className="header__signout__right"
            onClick={() => { logOut(); }}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOutAction()),
});

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  onBack: PropTypes.func,
  logOut: PropTypes.func.isRequired,
  selectedChat: PropTypes.string,
  onTitleClick: PropTypes.func,
};

Header.defaultProps = {
  subTitle: '',
  selectedChat: '',
  onBack: () => {},
  onTitleClick: null,
};

export default connect(undefined, mapDispatchToProps)(Header);
