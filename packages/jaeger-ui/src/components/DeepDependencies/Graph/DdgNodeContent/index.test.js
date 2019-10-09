// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

jest.mock('./calc-positioning', () => () => ({
  radius: 50,
  svcWidth: 20,
  opWidth: 30,
  svcMarginTop: 10,
}));

/* eslint-disable import/first */
import React from 'react';
import { shallow } from 'enzyme';

import DdgNodeContent from '.';
import { EViewModifier } from '../../../../model/ddg/types';

describe('<DdgNodeContent>', () => {
  const vertexKey = 'some-key';
  const service = 'some-service';
  const operation = 'some-operation';

  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      vertexKey,
      service,
      operation,
      isFocalNode: false,
      focalNodeUrl: 'some-url',
      setViewModifier: jest.fn(),
    };
    wrapper = shallow(<DdgNodeContent {...props} />);
  });

  it('does not explode', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('omits the operation if it is null', () => {
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ operation: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('calls setViewModifier on mouse over, out', () => {
    const { calls } = props.setViewModifier.mock;
    wrapper.simulate('mouseover', { type: 'mouseover' });
    expect(calls.length).toBe(1);
    wrapper.simulate('mouseout', { type: 'mouseout' });
    expect(calls.length).toBe(2);
    expect(calls[0]).toEqual([vertexKey, EViewModifier.Hovered, true]);
    expect(calls[1]).toEqual([vertexKey, EViewModifier.Hovered, false]);
  });

  it('renders correctly when isFocalNode = true and focalNodeUrl = null', () => {
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ focalNodeUrl: null, isFocalNode: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('DdgNodeContent.getNodeRenderer()', () => {
    let ddgVertex;

    beforeEach(() => {
      ddgVertex = {
        isFocalNode: false,
        key: 'some-key',
        operation: 'the-operation',
        service: 'the-service',
      };
    });

    it('returns a <DdgNodeContent />', () => {
      const ddgNode = DdgNodeContent.getNodeRenderer(() => undefined)(ddgVertex);
      expect(ddgNode).toBeDefined();
      expect(shallow(ddgNode)).toMatchSnapshot();
      expect(ddgNode.type).toBe(DdgNodeContent);
    });
  });
});
