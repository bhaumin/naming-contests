import React from 'react';
import PropTypes from 'prop-types';

class ContestPreview extends React.Component {
  handleClick = () => {
    this.props.onClick(this.props._id);
  }

  render() {
    return (
      <div className="ContestPreview link" onClick={this.handleClick}>
        <div className="category-name">
          {this.props.categoryName}
        </div>
        <div className="contest-name">
          {this.props.contestName}
        </div>
      </div>
    );
  }
}

ContestPreview.propTypes = {
  _id: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  contestName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ContestPreview;
