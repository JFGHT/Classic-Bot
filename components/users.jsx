import React from 'react';
import PropTypes from 'prop-types';

const Users = ({ users, channel }) => (
  <div style={{ height: 350, width: 150, overflowY: 'auto' }}>
    <b>
      {channel ? `${channel} (${users.size})` : null}
    </b>
    {[...users].map(([key, user]) => (
      <div key={key}>
        {user.toon_name}
      </div>
    ))}
  </div>
);

Users.propTypes = {
  users: PropTypes.instanceOf(Map).isRequired,
  channel: PropTypes.string.isRequired,
};

export default Users;
