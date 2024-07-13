import { formattedRowType, rowType } from "../types";
import { cnpj, cpf } from "cpf-cnpj-validator";

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const checkCalculationConsistency = (
  vlTotal: string,
  qtPrestacoes: string,
  vlPresta: string
): boolean => {
  const total = Math.floor(parseFloat(vlTotal));
  const installment = parseFloat(qtPrestacoes);

  const calculatedInstallmentValue = total / installment;

  return calculatedInstallmentValue === parseFloat(vlPresta);
};

const validateCpfCnpj = (string: string) => {
  if (cpf.isValid(string)) {
    return { tpDocumento: "CPF", nrDocumentoValido: true };
  }
  if (cnpj.isValid(string)) {
    return { tpDocumento: "CNPJ", nrDocumentoValido: true };
  }
  return { nrDocumentoValido: false };
};

export const formatRow = async (data: rowType): Promise<formattedRowType> => {
  const isConsistent = checkCalculationConsistency(
    data.vlTotal,
    data.qtPrestacoes,
    data.vlPresta
  );

  const parseAndFormat = (value: string): string => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return value;
    }
    return formatter.format(parsedValue);
  };

  data.vlPresta = parseAndFormat(data.vlPresta);
  data.vlMora = parseAndFormat(data.vlMora);
  data.vlMulta = parseAndFormat(data.vlMulta);
  data.vlOutAcr = parseAndFormat(data.vlOutAcr);
  data.vlIof = parseAndFormat(data.vlIof);
  data.vlDescon = parseAndFormat(data.vlDescon);
  data.vlAtual = parseAndFormat(data.vlAtual);
  data.vlTotal = parseAndFormat(data.vlTotal);

  const validatedDocument = validateCpfCnpj(data.nrCpfCnpj);

  return { ...data, ...validatedDocument, vlConsistente: isConsistent };
};
