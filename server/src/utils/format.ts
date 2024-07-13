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
  vlPresta: string,
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

  data.vlPresta = formatter.format(parseFloat(data.vlPresta));
  data.vlMora = formatter.format(parseFloat(data.vlMora));
  data.vlMulta = formatter.format(parseFloat(data.vlMulta));
  data.vlOutAcr = formatter.format(parseFloat(data.vlOutAcr));
  data.vlIof = formatter.format(parseFloat(data.vlIof));
  data.vlDescon = formatter.format(parseFloat(data.vlDescon));
  data.vlAtual = formatter.format(parseFloat(data.vlAtual));
  data.vlTotal = formatter.format(parseFloat(data.vlTotal));

  const validatedDocument = validateCpfCnpj(data.nrCpfCnpj);

  return { ...data, ...validatedDocument, vlConsistente: isConsistent };
};
