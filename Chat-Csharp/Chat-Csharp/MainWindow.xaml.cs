using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Threading;

using Quobject.SocketIoClientDotNet.Client;

namespace Chat_Csharp
{
    /// <summary>
    /// MainWindow.xaml에 대한 상호 작용 논리
    /// </summary>
    /// 
    

    public partial class MainWindow : Window
    {
        Program program;

        public MainWindow()
        {
            InitializeComponent();

            program = new Program();

            program.socket_.On(Socket.EVENT_CONNECT, () =>
            {
                program.socket_.Emit("message", "Enter");

            });

            program.socket_.On(Socket.EVENT_MESSAGE, (message) =>
            {
                chatBox.Dispatcher.Invoke((() => { chatBox.Text += message + "\n"; }));
            });
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            program.socket_.Emit("message", inputBox.Text);
            inputBox.Clear();
        }
    }
}
