import { renderHook, act } from '@testing-library/react';
import useFormAtualizarPeriodoSessao from '../useFormAtualizarPeriodoSessao';
import useAtualizarPeriodoSessao from '../useAtualizarPeriodoSessao';
import { SessaoVotacaoResponse } from '../../types/SessaoVotacao';
import React from 'react';

jest.mock('../useAtualizarPeriodoSessao');

interface MockChangeEvent extends Omit<React.ChangeEvent<HTMLInputElement>, 'target'> {
  target: {
    name: string;
    value: string;
  };
}

interface MockFormEvent extends Omit<React.FormEvent<HTMLFormElement>, 'preventDefault'> {
  preventDefault: () => void;
}

describe('useFormAtualizarPeriodoSessao', () => {
  const mockSessaoId = 123;
  const mockOnSuccess = jest.fn();

  const mockAtualizarPeriodo = jest.fn();
  const mockAtualizando = false;
  const mockErro = null;
  const mockEnviado = false;

  const mockResponse: SessaoVotacaoResponse = {
    id: 123,
    pautaId: 456,
    pautaTitulo: 'Teste de Pauta',
    dataAbertura: '2025-06-23T10:00:00',
    dataFechamento: '2025-06-23T12:00:00',
    status: 'ABERTA',
    abertaParaVotacao: true
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-23T10:00:00'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAtualizarPeriodo.mockResolvedValue(mockResponse);

    (useAtualizarPeriodoSessao as jest.Mock).mockReturnValue({
      atualizarPeriodo: mockAtualizarPeriodo,
      atualizando: mockAtualizando,
      erro: mockErro,
      enviado: mockEnviado
    });
  });

  const createMockFormEvent = (): MockFormEvent => ({
    preventDefault: jest.fn()
  } as MockFormEvent);

  const createMockChangeEvent = (name: string, value: string): MockChangeEvent => ({
    target: {
      name,
      value
    }
  } as MockChangeEvent);

  it('deve iniciar com os valores padrão corretos', () => {
    const { result } = renderHook(() =>
      useFormAtualizarPeriodoSessao({
        sessaoId: mockSessaoId,
        onSuccess: mockOnSuccess
      })
    );

    expect(result.current.formData).toEqual({
      minutosAdicionais: '',
      dataFim: ''
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.enviando).toBe(false);
    expect(result.current.enviado).toBe(false);
    expect(result.current.erro).toBeNull();
    expect(result.current.modo).toBe('minutos');
  });

  it('deve alterar o modo corretamente', () => {
    const { result } = renderHook(() =>
      useFormAtualizarPeriodoSessao({
        sessaoId: mockSessaoId,
        onSuccess: mockOnSuccess
      })
    );

    expect(result.current.modo).toBe('minutos');

    act(() => {
      result.current.setModo('data');
    });

    expect(result.current.modo).toBe('data');
  });

  it('deve validar corretamente o campo minutosAdicionais no modo minutos', async () => {
    const { result } = renderHook(() =>
      useFormAtualizarPeriodoSessao({
        sessaoId: mockSessaoId,
        onSuccess: mockOnSuccess
      })
    );

    await act(async () => {
      await result.current.handleSubmit(createMockFormEvent());
    });

    expect(result.current.errors.minutosAdicionais).toBeTruthy();

    act(() => {
      result.current.handleChange(createMockChangeEvent('minutosAdicionais', '0'));
    });

    await act(async () => {
      await result.current.handleSubmit(createMockFormEvent());
    });

    expect(result.current.errors.minutosAdicionais).toBeTruthy();

    act(() => {
      result.current.handleChange(createMockChangeEvent('minutosAdicionais', '30'));
    });

    expect(result.current.formData.minutosAdicionais).toBe('30');
  });

  it('deve validar corretamente o campo dataFim no modo data', async () => {
    const { result } = renderHook(() =>
      useFormAtualizarPeriodoSessao({
        sessaoId: mockSessaoId,
        onSuccess: mockOnSuccess
      })
    );

    act(() => {
      result.current.setModo('data');
    });

    await act(async () => {
      await result.current.handleSubmit(createMockFormEvent());
    });

    expect(result.current.errors.dataFim).toBeTruthy();

    const dataPassada = new Date();
    dataPassada.setDate(dataPassada.getDate() - 1);
    const dataPassadaStr = dataPassada.toISOString().split('T')[0] + 'T12:00:00';

    act(() => {
      result.current.handleChange(createMockChangeEvent('dataFim', dataPassadaStr));
    });

    await act(async () => {
      await result.current.handleSubmit(createMockFormEvent());
    });

    expect(result.current.errors.dataFim).toBeTruthy();

    const dataFutura = new Date();
    dataFutura.setDate(dataFutura.getDate() + 1);
    const dataFuturaStr = dataFutura.toISOString().split('T')[0] + 'T12:00:00';

    act(() => {
      result.current.handleChange(createMockChangeEvent('dataFim', dataFuturaStr));
    });

    expect(result.current.formData.dataFim).toBe(dataFuturaStr);
  });

  it('deve chamar atualizarPeriodo com minutosAdicionais no modo minutos', async () => {
    const { result } = renderHook(() =>
      useFormAtualizarPeriodoSessao({
        sessaoId: mockSessaoId,
        onSuccess: mockOnSuccess
      })
    );

    act(() => {
      result.current.handleChange(createMockChangeEvent('minutosAdicionais', '30'));
    });

    await act(async () => {
      await result.current.handleSubmit(createMockFormEvent());
    });

    expect(mockAtualizarPeriodo).toHaveBeenCalledWith(
      mockSessaoId,
      { minutosAdicionais: 30 }
    );
  });

  it('deve chamar atualizarPeriodo com dataFim no modo data', async () => {
    const { result } = renderHook(() =>
      useFormAtualizarPeriodoSessao({
        sessaoId: mockSessaoId,
        onSuccess: mockOnSuccess
      })
    );

    act(() => {
      result.current.setModo('data');
    });

    const dataFutura = new Date();
    dataFutura.setDate(dataFutura.getDate() + 1);
    const dataFuturaStr = dataFutura.toISOString().split('T')[0] + 'T12:00:00';

    act(() => {
      result.current.handleChange(createMockChangeEvent('dataFim', dataFuturaStr));
    });

    await act(async () => {
      await result.current.handleSubmit(createMockFormEvent());
    });

    expect(mockAtualizarPeriodo).toHaveBeenCalledWith(
      mockSessaoId,
      { dataFim: dataFuturaStr }
    );
  });
  
});