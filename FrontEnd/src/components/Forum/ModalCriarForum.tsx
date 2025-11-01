import { useState } from 'react'
import { forunsService } from '@/services/forum.services'

interface ModalCriarForumProps {
    aberto: boolean
    onFechar: () => void
    onCriado: () => void
}

export default function ModalCriarForum({ aberto, onFechar, onCriado }: ModalCriarForumProps) {
    const [nome, setNome] = useState('')
    const [assunto, setAssunto] = useState('')
    const [descricao, setDescricao] = useState('')
    const [palavrasChave, setPalavrasChave] = useState('')
    const [privacidade, setPrivacidade] = useState<'PUBLICO' | 'PRIVADO'>('PUBLICO')
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    if (!aberto) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErro(null)

        try {
            setLoading(true)

            const payload = {
                nome,
                assunto,
                descricao,
                palavrasChave: palavrasChave.split(',').map(p => p.trim()).filter(Boolean),
                privacidade,
            }

            await forunsService.criar(payload)
            onCriado()
            onFechar()
        } catch (err: any) {
            console.error('Erro ao criar fórum:', err)
            setErro(err.message || 'Erro ao criar fórum.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Criar Novo Fórum</h2>

                {erro && <p className="text-red-600 mb-3">{erro}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 mt-1"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assunto</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 mt-1"
                            value={assunto}
                            onChange={(e) => setAssunto(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            className="w-full border rounded p-2 mt-1"
                            rows={3}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Palavras-chave</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 mt-1"
                            placeholder="Ex: react, backend, javascript"
                            value={palavrasChave}
                            onChange={(e) => setPalavrasChave(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Privacidade</label>
                        <select
                            className="w-full border rounded p-2 mt-1"
                            value={privacidade}
                            onChange={(e) => setPrivacidade(e.target.value as 'PUBLICO' | 'PRIVADO')}
                        >
                            <option value="PUBLICO">Público</option>
                            <option value="PRIVADO">Privado</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={onFechar}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Criando...' : 'Criar Fórum'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}