import { zodValidator } from "@tanstack/zod-form-adapter";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const schema = z.object({ title: z.string().min(1) });

function Test() {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: { title: "" },
    validators: {
      onChange: schema,
    }
  });
}
