
from flask import Flask,render_template,request,jsonify,make_response,redirect
from auth import register,login,change_plan,delete as DeleteDB



app = Flask(__name__)
@app.route("/api/v1/delete")
def delete():
    response = DeleteDB(request.cookies.get('token',None))
    if response['status'] == 202:
        resp = make_response(redirect('/'))
        resp.delete_cookie('token',path='/')
        resp.delete_cookie('username',path='/')
        return resp
    return jsonify({'status':401,'msg':'Not Logged In!'})

@app.route("/api/v1/change_plan",methods=['POST'])
def plan(): # ! Por não estar em produção, não foi possivel integrar sistema de pagamento, aqui teria uma payment wall usando stripe ou o próprio mercado pago
    
    token = request.cookies.get('token',None)
    plan = request.get_json().get('plan',None)
    print(token,plan)
    if token and plan: # ! Nesse caso apenas retorno como se o pagamento fosse aprovado, mesmo nunca ter sido efetuado
        response = change_plan(plan,token)
        return jsonify(response)
    return jsonify({'status':401,'msg':'Not Logged In!'})


@app.route("/api/v1/logout")
def lougut(): 
    print(request.cookies)
    resp = make_response(redirect('/'))
    resp.delete_cookie('token',path='/')
    resp.delete_cookie('username',path='/')
    return resp
@app.route("/api/v1/register",methods=["POST"])
def Reg():
    data = request.get_json()
    un = data.get('username')
    email = data.get('email')
    pw = data.get('password')
    response = register(un,email,pw)
    resp = make_response('{"status":'+str(response['status'])+'}')
    print(response)
    # ! Pratica não usada em produção, todos cookies devem ter o secure = true, mas para ambientes de local host, é nescessário os desativar
    if response['status'] == 201:
        Token,Username = response['msg']['token'],response['msg']['username']
        resp.set_cookie('token',Token,(7*24*60*60),path='/',secure=False,httponly=True,samesite='Lax')
        resp.set_cookie('username',Username,(7*24*60*60),path='/',secure=False,httponly=False,samesite='Lax')
        print('Definido',Username,Token)
        return resp
    return jsonify(response)

@app.route("/api/v1/login",methods=["POST"])
def Log():
    data = request.get_json()
    Input = data.get('input')
    pw = data.get('password')
    response = login(Input,pw)
    resp = make_response('{"status":'+str(response['status'])+'}')
    print(response)
    # ! Pratica não usada em produção, todos cookies devem ter o secure = true, mas para ambientes de local host, é nescessário os desativar
    if response['status'] == 202:
        Token,Username = response['msg']['token'],response['msg']['username']
        resp.set_cookie('token',Token,(7*24*60*60),path='/',secure=False,httponly=True,samesite='Lax')
        resp.set_cookie('username',Username,(7*24*60*60),path='/',secure=False,httponly=False,samesite='Lax')
        print('Definido',Username,Token)
        return resp
    return jsonify(response)
    
@app.route("/", methods=["GET"])
def get_landing():
    return render_template('index.html')

@app.route('/login/',methods=["GET"])
def get_login():
    token = request.cookies.get('token',None)
    if token:
        return redirect('/')
    return render_template('login.html')
@app.route('/register/',methods=["GET"])
def get_register():
    return render_template('register.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)