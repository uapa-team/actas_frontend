import React from "react";
import { withRouter } from "react-router-dom";
import { Col, DatePicker, Space } from 'antd';

class DatesRange extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onStartChange = value => {
    this.setState({ startValue: value })
  };

  onEndChange = value => {
    this.setState({ endValue: value })
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Space>
        <DatePicker
          disabledDate={this.disabledStartDate}
          value={startValue}
          placeholder="Start"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          value={endValue}
          placeholder="End"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </Space>
    );
  }
}

export default withRouter(DatesRange);
// ReactDOM.render(<DatesRange />, mountNode);