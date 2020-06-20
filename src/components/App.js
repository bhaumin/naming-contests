import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import ContestList from './ContestList';
import Contest from './Contest';
import * as apiCalls from '../apiCalls';

const pushState = (obj, url) => {
  window.history.pushState(obj, '', url);
};

const onPopState = handler => {
  window.onpopstate = handler;
};

class App extends React.Component {
  static propTypes = {
    initialData: PropTypes.object.isRequired
  };

  state = this.props.initialData;

  componentDidMount() {
    onPopState(event => {
      this.setState({
        currentContestId: event.state ? event.state.currentContestId : null
      });
    });
  }

  componentWillUnmount() {
    onPopState(null);
  }

  fetchContest = (contestId) => {
    pushState(
      { currentContestId: contestId },
      `/contest/${contestId}`
    );

    apiCalls.fetchContest(contestId)
      .then(contest => {
        this.setState({
          currentContestId: contest._id,
          contests: {
            ...this.state.contests,
            [contest._id]: contest
          }
        });
      });
  };

  fetchContestList = () => {
    pushState(
      { currentContestId: null },
      '/'
    );

    apiCalls.fetchContestList()
      .then(contests => {
        this.setState({
          currentContestId: null,
          contests
        });
      });
  };

  fetchNames = (nameIds) => {
    if (nameIds.length === 0) {
      return;
    }

    apiCalls.fetchNames(nameIds)
      .then(names => {
        this.setState({
          names
        });
      });
  };

  addName = (newName, contestId) => {
    apiCalls.addName(newName, contestId)
      .then(resp => {
        this.setState({
          contests: {
            ...this.state.contests,
            [resp.updatedContest._id]: resp.updatedContest
          },
          names: {
            ...this.state.names,
            [resp.newName._id]: resp.newName
          }
        });
      })
      .catch(console.error);
  };

  lookupName = (nameId) => {
    if (!this.state.names || !this.state.names[nameId]) {
      return { name: '...' };
    }
    return this.state.names[nameId];
  };

  pageHeader = () => {
    if (this.state.currentContestId) {
      return this.currentContest().contestName;
    }

    return 'Naming Contests';
  };

  currentContest = () => {
    return this.state.contests[this.state.currentContestId];
  };

  currentContent = () => {
    if (this.state.currentContestId) {
      return <Contest
        contestListClick={this.fetchContestList}
        fetchNames={this.fetchNames}
        lookupName={this.lookupName}
        addName={this.addName}
        {...this.currentContest()} />;
    }

    return <ContestList
      onContestClick={this.fetchContest}
      contests={this.state.contests} />;
  };

  render() {
    return (
      <div className="App">
        <Header message={this.pageHeader()} />
        {this.currentContent()}
      </div>
    );
  }
}

export default App;
