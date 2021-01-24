import AxiosError from '../../src/common/error'
import axios from '../../src/index'

axios({
    url: '/base/get',
    method: 'get',
    params: {
        a: 1,
        b: 'sherry hu',
        c: ['hu','xiaoyan'],
        date: new Date(),
        obj: {
            fir: 'hu',
            date: new Date()
        }
    },
}).then(res => {
    console.log('get res', res)
})
axios({
    url: '/base/post',
    method: 'post',
    data: {
        name: 'sherry',
        age: 18
    }
}).then(res => {
    console.log('----', res)
}).catch((error:AxiosError) => {
    console.error(error.config)
})