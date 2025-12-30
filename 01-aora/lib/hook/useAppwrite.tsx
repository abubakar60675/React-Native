import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

interface UseAppwriteProps {
    fn: () => Promise<any>
}

const useAppwrite = ({ fn }: UseAppwriteProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState<any>(null)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await fn()
            setData(response)
        } catch (error: any) {
            Alert.alert('Error', error?.message ?? 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const refetch = () => fetchData()

    return { isLoading, data, refetch }
}

export default useAppwrite
