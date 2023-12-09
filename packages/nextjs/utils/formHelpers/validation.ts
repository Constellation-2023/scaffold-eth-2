import { Rule } from "antd/lib/form";

export const generalValidationRules: Rule[] = [{ required: true, message: "Field is required!" }];
export const generalValidationRulesOp: Rule[] = [{ required: false, message: "Field is required!" }];

export const textInputValidationRules: Rule[] = [...generalValidationRules, { whitespace: true }];
export const textInputValidationRulesOp: Rule[] = [
  {
    required: false,
    message: "Please input a non-empty value",
    whitespace: true,
  },
];

export const numberInputValidationRules: Rule[] = [...generalValidationRules, { type: "number" }];
export const numberInputValidationRulesOp: Rule[] = [...generalValidationRulesOp, { type: "number" }];
