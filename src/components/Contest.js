import React from 'react';
import PropTypes from 'prop-types';

class Contest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newNameInput: '',
    };

    // Lexical scoping due to how these methods are
    // defined below renders these binds unnecessary

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchNames(this.props.nameIds);
  }

  handleChange = (event) => {
    this.setState({
      newNameInput: event.target.value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.addName(this.state.newNameInput, this.props._id);
    this.setState({
      newNameInput: ''
    });
  };

  render() {
    return (
      <div className="Contest">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Contest Description</h3>
          </div>
          <div className="panel-body">
            <div className="contest-description">
              {this.props.description}
            </div>
          </div>
        </div>

        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Proposed Names</h3>
          </div>
          <div className="panel-body">
            <ul className="list-group">
              {this.props.nameIds.map(nameId =>
                <li className="list-group-item" key={nameId}>
                  {this.props.lookupName(nameId).name}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="panel panel-info">
          <div className="panel-heading">
            <h3 className="panel-title">Propose a New Name</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={this.handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="New Name Here..."
                  value={this.state.newNameInput}
                  onChange={this.handleChange}
                  required />
                <span className="input-group-btn">
                  <button type="submit" className="btn btn-info">Submit</button>
                </span>
              </div>
            </form>
          </div>
        </div>

        <div className="home-link link" onClick={this.props.contestListClick}>
          Contest List
        </div>
      </div>
    );
  }
}

Contest.propTypes = {
  _id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  nameIds: PropTypes.array.isRequired,
  contestListClick: PropTypes.func.isRequired,
  fetchNames: PropTypes.func.isRequired,
  lookupName: PropTypes.func.isRequired,
  addName: PropTypes.func.isRequired,
};

export default Contest;
