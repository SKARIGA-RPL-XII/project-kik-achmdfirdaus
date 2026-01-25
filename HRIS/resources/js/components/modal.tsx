import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { formatRupiah, parseRupiah } from '@/lib/rupiah'

/* =====================
   TYPE FIELD
===================== */
export type Field = {
    name: string
    label: string
    type?: 'text' | 'number' | 'textarea' | 'select' | 'rupiah'
    options?: { label: string; value: string | number }[]
    placeholder?: string
    required?: boolean
    min?: number
    max?: number
}

type ModalFormProps = {
    open: boolean
    title: string
    fields: Field[]
    submitUrl: string
    method?: 'post' | 'put'
    initialData?: Record<string, any>
    onClose: () => void
}

export default function ModalForm({
    open,
    title,
    fields,
    submitUrl,
    method = 'post',
    initialData = {},
    onClose,
}: ModalFormProps) {
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

    const form = useForm<Record<string, any>>({})

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = form

    useEffect(() => {
        if (open) {
            Object.keys(initialData).forEach((key) => {
                setData(key, initialData[key])
            })
        } else {
            reset()
            clearErrors()
            setClientErrors({})
        }
    }, [open])


    function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return

        method === 'post'
            ? post(submitUrl, { onSuccess: onClose })
            : put(submitUrl, { onSuccess: onClose })
    }

    function validate() {
        const errs: Record<string, string> = {}

        fields.forEach((field) => {
            const value = data[field.name]

            if (field.required && (value === undefined || value === '')) {
                errs[field.name] = `${field.label} wajib diisi`
                return
            }

            if (field.type === 'number' || field.type === 'rupiah') {
                const num = Number(value)

                if (isNaN(num)) {
                    errs[field.name] = `${field.label} harus berupa angka`
                    return
                }

                if (field.min !== undefined && num < field.min) {
                    errs[field.name] = `${field.label} minimal ${field.min}`
                }

                if (field.max !== undefined && num > field.max) {
                    errs[field.name] = `${field.label} maksimal ${field.max}`
                }
            }
        })

        setClientErrors(errs)
        return Object.keys(errs).length === 0
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) onClose()
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label className="text-sm font-medium">
                                {field.label}
                            </label>

                            {(!field.type ||
                                field.type === 'text' ||
                                field.type === 'number') && (
                                    <input
                                        type={field.type ?? 'text'}
                                        value={data[field.name] ?? ''}
                                        placeholder={field.placeholder}
                                        onChange={(e) =>
                                            setData(field.name, e.target.value)
                                        }
                                        className="w-full rounded border px-3 py-2 text-sm"
                                    />
                                )}

                            {field.type === 'textarea' && (
                                <textarea
                                    value={data[field.name] ?? ''}
                                    onChange={(e) =>
                                        setData(field.name, e.target.value)
                                    }
                                    className="w-full rounded border px-3 py-2 text-sm"
                                />
                            )}

                            {field.type === 'select' && (
                                <select
                                    value={data[field.name] ?? ''}
                                    onChange={(e) =>
                                        setData(field.name, e.target.value)
                                    }
                                    className="w-full rounded border px-3 py-2 text-sm"
                                >
                                    <option value="">
                                        Pilih {field.label}
                                    </option>
                                    {field.options?.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {field.type === 'rupiah' && (
                                <input
                                    type="text"
                                    value={formatRupiah(data[field.name] ?? '')}
                                    onChange={(e) =>
                                        setData(
                                            field.name,
                                            parseRupiah(e.target.value)
                                        )
                                    }
                                    placeholder="Rp 0"
                                    className="w-full rounded border px-3 py-2 text-sm"
                                />
                            )}

                            {(clientErrors[field.name] ||
                                errors[field.name]) && (
                                    <p className="text-sm text-red-500">
                                        {clientErrors[field.name] ||
                                            errors[field.name]}
                                    </p>
                                )}
                        </div>
                    ))}

                    <div className="flex justify-end gap-2 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Batal
                        </Button>

                        <Button type="submit" disabled={processing}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
