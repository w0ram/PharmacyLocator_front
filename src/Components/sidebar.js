import React from 'react';
import { Breadcrumb } from 'antd';

export default function BAR() {

  return (
    <Breadcrumb
    items={[
      {
        title: 'Home',
      },
      {
        title: 'Application Center',
      },
      {
        title: 'Application List',
      },
      {
        title: 'An Application',
      },
    ]}
  />
);
}
