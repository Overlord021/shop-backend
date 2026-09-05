// ==================== Flatten Zod Error ====================

import { flattenError } from "zod";

export default function flattenZodError(errs) {
  const fieldErrors = flattenError(errs).fieldErrors;
  const errors = [];
  for (const key in fieldErrors) {
    const error = fieldErrors[key][0];

    errors.push(error);
  }

  return { errors };
}
