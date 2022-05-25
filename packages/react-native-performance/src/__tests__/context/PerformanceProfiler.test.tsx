/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {renderHook} from '@testing-library/react-hooks';

import {PerformanceProfiler} from '../../context';
import useReportEmitter from '../../context/useReportEmitter';
import {OnStateChangedListener, useStateController, useStateControllerInitializer} from '../../state-machine';
import useNativeRenderCompletionEvents from '../../context/useNativeRenderCompletionEvents';

jest.mock('../../state-machine/controller/useStateControllerInitializer', () => {
  return jest.fn();
});

jest.mock('../../context/useReportEmitter', () => {
  return jest.fn();
});

jest.mock('../../context/useNativeRenderCompletionEvents', () => {
  return jest.fn();
});

describe('context/PerformanceProfiler', () => {
  const mockStateController = {key: 'value'};
  let mockReportEmitter: OnStateChangedListener;

  beforeEach(() => {
    mockReportEmitter = jest.fn();
    // @ts-ignore
    useStateControllerInitializer.mockReturnValue(mockStateController);
    // @ts-ignore
    useReportEmitter.mockReturnValue(mockReportEmitter);

    // @ts-ignore
    useNativeRenderCompletionEvents.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('intializes the state controller via the useStateControllerInitializer hook', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <PerformanceProfiler onReportPrepared={jest.fn()}>{children}</PerformanceProfiler>
    );

    const resolvedStateController = renderHook(() => useStateController(), {
      wrapper,
    }).result.current;

    expect(resolvedStateController).toBe(mockStateController);
  });

  it('uses the report emitter prepared by the useReportEmitter hook', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <PerformanceProfiler onReportPrepared={jest.fn()}>{children}</PerformanceProfiler>
    );

    expect(useStateControllerInitializer).not.toHaveBeenCalled();

    renderHook(() => useStateController(), {wrapper});

    // @ts-ignore
    expect(useStateControllerInitializer.mock.calls[0][0].reportEmitter).toBe(mockReportEmitter);
  });

  it('sets up the native render completion event listener', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <PerformanceProfiler onReportPrepared={jest.fn()}>{children}</PerformanceProfiler>
    );

    expect(useNativeRenderCompletionEvents).not.toHaveBeenCalled();
    renderHook(() => useStateController(), {wrapper});
    expect(useNativeRenderCompletionEvents).toHaveBeenCalledTimes(1);
  });
});