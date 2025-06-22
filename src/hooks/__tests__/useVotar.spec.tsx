import { renderHook, act } from '@testing-library/react';
import { votoService } from '../../service/VotoService';
import useVotar from '../useVotar';
import { OpcaoVoto, VotoResponse } from '../../types/Voto';

jest.mock('../../service/VotoService');

describe('useVotar', () => {

  const associadoId = 1;
  const pautaId = 5;
  const opcaoVoto = OpcaoVoto.SIM;
  
  const mockVotoResponse: VotoResponse = {
    id: 10,
    opcao: OpcaoVoto.SIM,
    dataHora: '2025-06-22T14:30:00',
    associadoId: associadoId,
    associadoNome: 'João Silva',
    pautaId: pautaId,
    pautaTitulo: 'Pauta Teste'
  };

  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mocked(votoService.registrarVoto).mockResolvedValue(mockVotoResponse);
  });

  it('deve inicializar com os estados padrão', () => {
    const { result } = renderHook(() => useVotar());

    expect(result.current.votando).toBe(false);
    expect(result.current.erro).toBeNull();
    expect(result.current.resultado).toBeNull();
  });

  it('deve registrar um voto com sucesso', async () => {
    const { result } = renderHook(() => useVotar({ onSuccess: mockOnSuccess }));

    await act(async () => {
      await result.current.votar(associadoId, pautaId, opcaoVoto);
    });

    expect(votoService.registrarVoto).toHaveBeenCalledWith({
      associadoId,
      pautaId,
      opcao: opcaoVoto
    });

    expect(result.current.votando).toBe(false);
    expect(result.current.erro).toBeNull();
    expect(result.current.resultado).toEqual(mockVotoResponse);

    expect(mockOnSuccess).toHaveBeenCalledWith(mockVotoResponse);
  });

  it('deve lidar com erro ao registrar voto', async () => {
    const errorMessage = 'Erro ao registrar voto';
    const error = new Error(errorMessage);
    jest.mocked(votoService.registrarVoto).mockRejectedValue(error);

    const { result } = renderHook(() => useVotar({ onError: mockOnError }));

    await act(async () => {
      try {
        await result.current.votar(associadoId, pautaId, opcaoVoto);
        fail('A função deveria ter lançado um erro');
      } catch (error) {
        expect(error).toBe(error);
      }
    });

    expect(result.current.votando).toBe(false);
    expect(result.current.erro).toBe(errorMessage);
    expect(result.current.resultado).toBeNull();

    expect(mockOnError).toHaveBeenCalledWith(errorMessage);
  });

  it('deve definir o estado "votando" durante o processo', async () => {
    let resolveVoto: (value: VotoResponse) => void;
    const votoPromise = new Promise<VotoResponse>(resolve => {
      resolveVoto = resolve;
    });

    jest.mocked(votoService.registrarVoto).mockReturnValue(votoPromise);

    const { result } = renderHook(() => useVotar());

    const votandoAntes = result.current.votando;

    let promiseVotacao: Promise<VotoResponse>;
    act(() => {
      promiseVotacao = result.current.votar(associadoId, pautaId, opcaoVoto);
    });
 
    expect(votandoAntes).toBe(false);
    expect(result.current.votando).toBe(true);

    await act(async () => {
      resolveVoto!(mockVotoResponse);
      await promiseVotacao;
    });

    expect(result.current.votando).toBe(false);
  });

  it('deve lidar com votos NÃO corretamente', async () => {
    const naoVotoResponse = { 
      ...mockVotoResponse,
      opcao: OpcaoVoto.NAO
    };
    
    jest.mocked(votoService.registrarVoto).mockResolvedValue(naoVotoResponse);

    const { result } = renderHook(() => useVotar());

    await act(async () => {
      await result.current.votar(associadoId, pautaId, OpcaoVoto.NAO);
    });

    expect(votoService.registrarVoto).toHaveBeenCalledWith({
      associadoId,
      pautaId,
      opcao: OpcaoVoto.NAO
    });

    expect(result.current.resultado).toEqual(naoVotoResponse);
  });

  it('deve manter o mesmo resultado entre chamadas subsequentes', async () => {
    const { result } = renderHook(() => useVotar());

    await act(async () => {
      await result.current.votar(associadoId, pautaId, opcaoVoto);
    });

    const primeiroResultado = result.current.resultado;

    const segundoMockVoto = { 
      ...mockVotoResponse,
      id: 11
    };
    jest.mocked(votoService.registrarVoto).mockResolvedValue(segundoMockVoto);

    await act(async () => {
      await result.current.votar(associadoId, pautaId + 1, opcaoVoto);
    });

    expect(result.current.resultado).not.toBe(primeiroResultado);
    expect(result.current.resultado).toEqual(segundoMockVoto);
  });
});