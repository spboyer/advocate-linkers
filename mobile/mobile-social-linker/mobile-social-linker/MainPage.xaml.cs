using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace mobile_social_linker
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();

            if (string.IsNullOrEmpty(Alias.Text))
                Alias.Text = await SecureStorage.GetAsync("Alias");
        }

        private async void Entry_TextChanged(object sender, TextChangedEventArgs e)
        {
            await SecureStorage.SetAsync("Alias", e.NewTextValue);
        }
    }
}
