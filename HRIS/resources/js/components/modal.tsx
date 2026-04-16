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
            setData({ ...initialData })
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
            <DialogContent className="sm:max-w-[425px] p-6 overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border-gray-100">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-5">
                    <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 -mr-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {fields.map((field) => (
                            <div key={field.name} className="group flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-[#dc2626]">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
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
                                            className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all duration-300 focus:bg-white focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/10 hover:border-gray-300 shadow-sm"
                                        />
                                    )}

                                {field.type === 'textarea' && (
                                    <textarea
                                        value={data[field.name] ?? ''}
                                        onChange={(e) =>
                                            setData(field.name, e.target.value)
                                        }
                                        className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all duration-300 focus:bg-white focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/10 hover:border-gray-300 shadow-sm min-h-[100px] resize-y"
                                    />
                                )}

                                {field.type === 'select' && (
                                    <select
                                        value={data[field.name] ?? ''}
                                        onChange={(e) =>
                                            setData(field.name, e.target.value)
                                        }
                                        className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all duration-300 focus:bg-white focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/10 hover:border-gray-300 shadow-sm appearance-none outline-none cursor-pointer"
                                    >
                                        <option value="" disabled className="text-gray-400">
                                            Pilih {field.label}
                                        </option>
                                        {field.options?.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                                className="text-gray-900"
                                            >
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {field.type === 'rupiah' && (
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                                        <input
                                            type="text"
                                            value={formatRupiah(data[field.name] ?? '')}
                                            onChange={(e) =>
                                                setData(
                                                    field.name,
                                                    parseRupiah(e.target.value)
                                                )
                                            }
                                            placeholder="0"
                                            className="w-full rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm transition-all duration-300 focus:bg-white focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/10 hover:border-gray-300 shadow-sm"
                                        />
                                    </div>
                                )}

                                <div className={`overflow-hidden transition-all duration-300 ${(clientErrors[field.name] || errors[field.name]) ? 'h-5 mt-1' : 'h-0 mt-0'}`}>
                                    <p className="text-xs text-red-500 font-medium">
                                        {clientErrors[field.name] || errors[field.name]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            Batal
                        </Button>

                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-md shadow-[#dc2626]/20 transition-all duration-300 active:scale-95"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                    Menyimpan...
                                </span>
                            ) : (
                                "Simpan"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
