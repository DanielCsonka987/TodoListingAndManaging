async function interpretSessionStore(datas, parentSessionContainer, parentStateSetter){
    if(datas){
        if(parentSessionContainer){ //PAGE REFRESH PROCESS - LoggedInStatus restoration

            const userDet = await {
                id: sessionStorage.getItem('profId'),
                fullname: sessionStorage.getItem('profFullname'),
                age: sessionStorage.getItem('profAge'),
                occupation: sessionStorage.getItem('profOccup'),
                manageProfile: sessionStorage.getItem('profManage'),
                logoutProfile: sessionStorage.getItem('profLogout'),
                getAddTodos: sessionStorage.getItem('profTodos')
              }
              
            parentStateSetter({
                target: {
                    name: parentSessionContainer,
                    value: userDet
                }
            })

        }else{  //LOGIN PROCESS
            sessionStorage.setItem('profId', datas.id);
            sessionStorage.setItem('profFullname', datas.fullname)
            sessionStorage.setItem('profAge', datas.age)
            sessionStorage.setItem('profOccup', datas.occupation)
            sessionStorage.setItem('profManage', datas.manageProfile)
            sessionStorage.setItem('profLogout', datas.logoutProfile)
            sessionStorage.setItem('profTodos', datas.getAddTodos)
        }
    }else{  //LOGOUT PROCESS
        sessionStorage.removeItem('profId')
        sessionStorage.removeItem('profFullname')
        sessionStorage.removeItem('profAge')
        sessionStorage.removeItem('profOccup')
        sessionStorage.removeItem('profManage')
        sessionStorage.removeItem('profLogout')
    }
}

export default interpretSessionStore