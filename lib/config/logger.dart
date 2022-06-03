import 'package:roggle/roggle.dart';

/// ロガーパッケージ（すささん作）
/// https://pub.dev/packages/roggle
final logger = Roggle(
  printer: SinglePrettyPrinter(
    // warning 以上の場合、stackTrace も出力する
    stackTraceLevel: Level.warning,
  ),
);
