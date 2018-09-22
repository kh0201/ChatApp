using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Quobject.SocketIoClientDotNet.Client;

namespace Chat_Csharp
{
    class Program
    {
        public Socket socket_;

        public Program() {
            socket_ = IO.Socket("http://localhost:5000");
        }
    }
}
