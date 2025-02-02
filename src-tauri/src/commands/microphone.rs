use std::{ffi::OsStr, os::windows::ffi::OsStrExt, rc::Rc};
use tauri::{AppHandle, Manager, WebviewWindow};
use webview2_com::Microsoft::Web::WebView2::Win32::{
    ICoreWebView2Profile4, ICoreWebView2SetPermissionStateCompletedHandler,
    ICoreWebView2SetPermissionStateCompletedHandler_Impl, ICoreWebView2_13,
    COREWEBVIEW2_PERMISSION_STATE,
    COREWEBVIEW2_PERMISSION_STATE_ALLOW,
    COREWEBVIEW2_PERMISSION_STATE_DENY,
};
use windows_core::{implement, Interface, PCWSTR};
use windows_result::HRESULT;

#[tauri::command]
pub fn allow_microphone(app_handle: AppHandle, addr: String) {
    let main_window = app_handle.get_webview_window("main").unwrap();
    set_permission_state(
        main_window,
        addr,
        COREWEBVIEW2_PERMISSION_STATE_ALLOW,
    );
}

#[tauri::command]
pub fn deny_microphone(app_handle: AppHandle, addr: String) {
    let main_window = app_handle.get_webview_window("main").unwrap();
    set_permission_state(
        main_window,
        addr,
        COREWEBVIEW2_PERMISSION_STATE_DENY,
    );
}

fn set_permission_state(
    main_window: WebviewWindow,
    origin: String,
    state: COREWEBVIEW2_PERMISSION_STATE,
) {
    main_window
        .with_webview(move |webview| unsafe {
            let origin = str_to_pcwstr(&origin.clone());
            let core_webview_13: ICoreWebView2_13 =
                webview.controller().CoreWebView2().unwrap().cast().unwrap();
            let profile4: ICoreWebView2Profile4 =
                core_webview_13.Profile().unwrap().cast().unwrap();

            let handler = SetPermissionStateCompletedHandler::new(|result| {
                println!("SetPermissionStateCompletedHandler: {:?}", result);
                Ok(())
            });

            profile4.SetPermissionState(
            webview2_com::Microsoft::Web::WebView2::Win32::COREWEBVIEW2_PERMISSION_KIND_MICROPHONE,
            origin,
            state,
            &handler,
        ).unwrap();
        })
        .unwrap();
}

#[implement(ICoreWebView2SetPermissionStateCompletedHandler)]
struct SetPermissionStateCompletedHandler {
    callback: Rc<dyn Fn(HRESULT) -> windows_result::Result<()>>,
}

impl SetPermissionStateCompletedHandler {
    pub fn new<F: Fn(HRESULT) -> windows_result::Result<()> + 'static>(
        callback: F,
    ) -> ICoreWebView2SetPermissionStateCompletedHandler {
        let handler = SetPermissionStateCompletedHandler {
            callback: Rc::new(callback),
        };
        handler.into()
    }
}

impl ICoreWebView2SetPermissionStateCompletedHandler_Impl for SetPermissionStateCompletedHandler {
    fn Invoke(&self, result: HRESULT) -> windows_result::Result<()> {
        (self.callback)(result)
    }
}

fn str_to_pcwstr(s: &str) -> PCWSTR {
    let wide: Vec<u16> = OsStr::new(s)
        .encode_wide()
        .chain(std::iter::once(0))
        .collect();
    PCWSTR::from_raw(wide.as_ptr())
}
